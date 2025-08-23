import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Send, User } from 'lucide-react'

const ChatDetail = () => {
  const { chatId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherParticipant, setOtherParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (chatId && user) {
      fetchChat()
      fetchMessages()
      subscribeToMessages()
    }

    return () => {
      // Clean up subscription
    }
  }, [chatId, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChat = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          participant_1,
          participant_2,
          participant_1_profile:profiles!chats_participant_1_fkey(display_name, avatar_url),
          participant_2_profile:profiles!chats_participant_2_fkey(display_name, avatar_url)
        `)
        .eq('id', chatId)
        .single()

      if (error) {
        console.error('Error fetching chat:', error)
        return
      }

      // Determine which participant is the other user
      const isParticipant1 = data.participant_1 === user.id
      const other = isParticipant1 ? data.participant_2_profile : data.participant_1_profile
      setOtherParticipant(other)
    } catch (error) {
      console.error('Error fetching chat:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(display_name, avatar_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      }, (payload) => {
        // Fetch the new message with sender info
        fetchMessages()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending || !user) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content: messageContent
        })

      if (error) {
        console.error('Error sending message:', error)
        setNewMessage(messageContent) // Restore message on error
        return
      }

      // Update chat timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId)

    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageContent) // Restore message on error
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/app/chats')}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {otherParticipant?.avatar_url ? (
          <img
            src={otherParticipant.avatar_url}
            alt={otherParticipant.display_name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}

        <h2 className="font-medium text-gray-900">
          {otherParticipant?.display_name || 'Unknown User'}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Start your conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === user.id
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-pink-100' : 'text-gray-500'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatDetail