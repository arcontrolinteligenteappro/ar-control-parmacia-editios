import React, { useState, useRef, useEffect } from 'react';
import { generatePharmaResponse } from '../services/geminiService';
import { useStore } from '../context/StoreContext';
import { Icons } from '../constants';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PharmaAI: React.FC = () => {
  const { data } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola. Soy Pharmabot. ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre medicamentos, interacciones o consultar tu inventario.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare context from store (inventory summary)
    const contextData = {
      totalProducts: data.products.length,
      lowStock: data.products.filter(p => p.batches.reduce((s,b) => s+b.quantity, 0) <= p.minStock).map(p => p.name),
      antibiotics: data.products.filter(p => p.type.includes('Antibiótico')).map(p => p.name),
      expiringSoon: data.products.flatMap(p => p.batches.filter(b => new Date(b.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 3))).map(b => `${p.name} (Lote: ${b.batchNumber})`))
    };

    const contextString = JSON.stringify(contextData);
    const responseText = await generatePharmaResponse(userMsg.content, contextString);

    setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex items-center gap-2">
        <Icons.AI />
        <h2 className="font-bold">Asistente Inteligente PHARMACLIC</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none prose prose-sm'
            }`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-bl-none flex gap-1">
               <span className="animate-bounce">●</span>
               <span className="animate-bounce delay-100">●</span>
               <span className="animate-bounce delay-200">●</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
         <div className="flex gap-2">
           <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre medicamentos, COFEPRIS o tu inventario..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
           />
           <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition">
             Enviar
           </button>
         </div>
         {!process.env.API_KEY && (
           <p className="text-xs text-red-500 mt-2 text-center">⚠️ API Key de Gemini no detectada. La IA responderá con un error.</p>
         )}
      </div>
    </div>
  );
};

export default PharmaAI;