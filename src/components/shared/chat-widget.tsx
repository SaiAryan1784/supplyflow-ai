"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, MessageCircle, Send, Bot, User as UserIcon, Minimize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
}

export function ChatWidget({ isOpen, onClose, onMinimize }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your SupplyFlow AI assistant. How can I help you today?\n\nI can assist you with:\n• Getting started with SupplyFlow AI\n• Understanding disruptions and alerts\n• Routing optimization\n• Demand forecasting\n• Technical support\n\nFeel free to ask me anything!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: Record<string, string> = {
    "hello": "Hello! How can I assist you with SupplyFlow AI today?",
    "help": "I can help you with various topics including:\n• Getting started with SupplyFlow AI\n• Understanding disruption alerts\n• Routing optimization\n• Demand forecasting\n• Technical support\n\nWhat would you like to know more about?",
    "disruptions": "Our disruption detection system monitors your supply chain 24/7 and can identify:\n• Weather-related delays\n• Traffic congestion\n• Supplier issues\n• Demand spikes\n• Geopolitical events\n\nYou can view all current disruptions in the Disruptions dashboard.",
    "routing": "Our AI-powered routing optimization helps you:\n• Find the most efficient routes\n• Reduce transportation costs\n• Minimize delivery times\n• Avoid known disruptions\n\nWould you like to learn about a specific routing feature?",
    "forecasting": "Our demand forecasting uses machine learning to:\n• Predict future demand patterns\n• Identify seasonal trends\n• Account for external factors\n• Achieve 85-95% accuracy\n\nCheck the Forecasting dashboard to see your predictions.",
    "support": "For additional support, you can:\n• Email us at support@supplyflow.ai\n• Call us at +1 (555) 123-4567\n• Visit our Support Center\n• Check our FAQ section\n\nIs there something specific I can help you with right now?",
    "pricing": "For pricing information and custom plans, please contact our sales team at sales@supplyflow.ai or schedule a demo through our website.",
    "integration": "SupplyFlow AI integrates with popular systems including:\n• ERP systems (SAP, Oracle, etc.)\n• Inventory management platforms\n• Logistics providers\n• Custom APIs\n\nWould you like help with a specific integration?",
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const lowerMessage = userMessage.toLowerCase();
      
      // Check for exact matches first
      for (const [key, response] of Object.entries(predefinedResponses)) {
        if (lowerMessage.includes(key)) {
          const followUpPrompts = [
            "\n\nIs there anything else I can help you with?",
            "\n\nDo you have any other questions about SupplyFlow AI?",
            "\n\nWould you like to know more about any other features?",
            "\n\nFeel free to ask me anything else!",
            "\n\nIs there another topic you'd like to explore?"
          ];
          
          const randomPrompt = followUpPrompts[Math.floor(Math.random() * followUpPrompts.length)];
          return response + randomPrompt;
        }
      }

      // Check for common question patterns
      if (lowerMessage.includes("how") && lowerMessage.includes("start")) {
        return "To get started with SupplyFlow AI:\n1. Complete your profile setup\n2. Connect your data sources\n3. Explore the Dashboard\n4. Set up your first routes\n5. Configure disruption alerts\n\nWould you like detailed guidance on any of these steps?";
      }

      if (lowerMessage.includes("cost") || lowerMessage.includes("price")) {
        return predefinedResponses.pricing + "\n\nDo you have any other questions?";
      }

      if (lowerMessage.includes("error") || lowerMessage.includes("problem") || lowerMessage.includes("issue")) {
        return "I'm sorry to hear you're experiencing an issue. For technical problems:\n• Try refreshing the page\n• Clear your browser cache\n• Check your internet connection\n\nIf the issue persists, please contact our technical support at support@supplyflow.ai with details about the error.\n\nIs there anything else I can assist you with?";
      }

      // Default response
      return "I understand you're asking about that topic. For detailed assistance, I'd recommend:\n• Checking our FAQ section\n• Contacting our support team at support@supplyflow.ai\n• Scheduling a call with our experts\n\nWhat else would you like to know about SupplyFlow AI?";
    } catch (error) {
      console.error('Bot response error:', error);
      return "I'm having trouble processing your request right now. Please try again or contact our support team at support@supplyflow.ai for assistance.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const currentMessage = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Generate bot response
      const botResponseText = await generateBotResponse(currentMessage);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error generating response:', error);
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team at support@supplyflow.ai for assistance.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Getting started",
    "About disruptions",
    "Route optimization",
    "Demand forecasting",
    "Contact support",
    "Integrations",
  ];

  const suggestedQuestions = [
    "How accurate are the forecasts?",
    "What integrations are available?",
    "How does route optimization work?",
    "What types of disruptions can you detect?",
    "How do I set up alerts?",
    "Can I customize the dashboard?",
  ];

  const handleQuickAction = async (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const botResponseText = await generateBotResponse(action);
      
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: botResponseText,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error generating response:', error);
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again or contact our support team.",
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 500);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-2rem)] shadow-lg z-50 flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-blue-600" />
          SupplyFlow Assistant
          <Badge variant="secondary" className="text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            Online
          </Badge>
        </CardTitle>
        <div className="flex gap-1">
          {onMinimize && (
            <Button variant="ghost" size="icon" onClick={onMinimize} className="h-6 w-6">
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.sender === "user" ? (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <UserIcon className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions - Show initially */}
        {messages.length === 1 && (
          <div className="p-4 border-t">
            <p className="text-xs text-gray-500 mb-3">Quick actions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-2 justify-start text-left whitespace-normal"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={messages.length > 1 ? "Ask me anything about SupplyFlow AI..." : "Type your message..."}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {messages.length > 1 && (
            <p className="text-xs text-gray-500 mt-2">
              💡 Try asking about features, getting started, or troubleshooting
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-40"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>

      <ChatWidget 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onMinimize={handleMinimize}
      />
    </>
  );
}
