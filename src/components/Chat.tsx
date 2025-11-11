import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '../types';
import { fetchGeminiResponse } from '../services/geminiService';
import { ANI_AVATAR_URL, EMERGENCY_CONTACTS, USER_AVATAR_URL } from '../constants';

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isModel = message.role === 'model';

    const parseMessageText = (text: string) => {
        return text.split('\n').map((line, index) => {
            const urlRegexSource = '(https?:\\/\\/\\S+)';
            const phoneRegexSource = '(\\b\\d{7,10}\\b)';
            const combinedRegex = new RegExp(`${urlRegexSource}|${phoneRegexSource}`, 'g');

            if (!line.trim()) {
                return <p key={index} className="h-4" />;
            }

            const parts = line.split(combinedRegex).filter(Boolean);

            return (
                <p key={index} className="whitespace-pre-wrap text-justify">
                    {parts.map((part, i) => {
                        if (part.match(new RegExp(`^${urlRegexSource}$`))) {
                            return (
                                <a
                                    key={i}
                                    href={part}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-500 underline hover:text-sky-700"
                                >
                                    {part}
                                </a>
                            );
                        }
                        if (part.match(new RegExp(`^${phoneRegexSource}$`))) {
                            return (
                                <span key={i} className="text-orange-500 font-semibold">
                                    {part}
                                </span>
                            );
                        }
                        return part;
                    })}
                </p>
            );
        });
    };


    return (
        <div className={`flex items-start gap-3 my-4 ${!isModel && 'flex-row-reverse'}`}>
            <img 
                src={isModel ? ANI_AVATAR_URL : USER_AVATAR_URL} 
                alt={isModel ? "ANI Avatar" : "User Avatar"}
                className={`w-10 h-10 rounded-full border-2 ${isModel ? 'border-sky-300' : 'border-yellow-300'}`}
            />
            <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02] ${
                    isModel
                        ? 'bg-sky-100 text-sky-900 rounded-tl-none'
                        : 'bg-yellow-100 text-yellow-900 rounded-tr-none'
                }`}
            >
                <div className="px-4 py-3">
                    {parseMessageText(message.text)}
                </div>

                {isModel && (
                    <div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2 mt-1">
                        <a 
                            href="https://sorts.one/g69" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="Visitar el portal de turismo"
                            className="text-sky-600 hover:text-sky-800 transition-colors"
                            aria-label="Portal de Turismo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
                            </svg>
                        </a>
                        <a 
                            href="https://www.nocaima-cundinamarca.gov.co/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title="Visitar el portal institucional"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label="Portal Institucional"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};


const TypingIndicator: React.FC = () => (
    <div className="flex items-start gap-3 my-4">
        <img src={ANI_AVATAR_URL} alt="ANI Avatar" className="w-10 h-10 rounded-full border-2 border-sky-300" />
        <div className="bg-sky-100 text-sky-900 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg">
            <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);

const InterestButton: React.FC<{ onClick: () => void; children: React.ReactNode; icon: string }> = ({ onClick, children, icon }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-full hover:bg-sky-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm hover:shadow-md"
    >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{children}</span>
    </button>
);

const InterestSelector: React.FC<{ onSelect: (interest: string) => void }> = ({ onSelect }) => (
    <div className="flex flex-wrap justify-center gap-3 my-4 px-4 animate-fade-in">
        <InterestButton onClick={() => onSelect('Aventura')} icon="🧗">Aventura</InterestButton>
        <InterestButton onClick={() => onSelect('Relax')} icon="🧘">Relax</InterestButton>
        <InterestButton onClick={() => onSelect('Gastronomía')} icon="🍲">Gastronomía</InterestButton>
        <InterestButton onClick={() => onSelect('Cultura')} icon="🎭">Cultura</InterestButton>
    </div>
);

const EmergencyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 m-4 max-w-sm w-full transform transition-transform duration-300 scale-95 animate-modal-pop-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Teléfonos de Emergencia
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-800 text-3xl font-light leading-none"
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </div>
                <ul className="space-y-3">
                    {Object.entries(EMERGENCY_CONTACTS).map(([name, numbers]) => (
                        <li key={name} className="py-2 border-b border-gray-200 last:border-b-0">
                            <p className="font-semibold text-gray-700">{name}</p>
                            <div className="flex flex-col mt-1">
                                {numbers.map((number) => (
                                    <a
                                        href={`tel:${number}`}
                                        key={number}
                                        className="text-sky-600 hover:underline"
                                    >
                                        {number}
                                    </a>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showInterestButtons, setShowInterestButtons] = useState(true);
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // La sesión de chat ya no se gestiona en el cliente, por lo que `chatSessionRef` se elimina.
    
    // Función para obtener la respuesta del backend
    const getAndSetResponse = useCallback(async (currentMessages: Message[]) => {
        setIsLoading(true);
        setError(null);
        try {
            const responseText = await fetchGeminiResponse(currentMessages);
            const modelMessage: Message = { role: 'model', text: responseText };
            setMessages((prev) => [...prev, modelMessage]);
        } catch (err: any) {
            console.error('Error getting response:', err);
            setError(err.message || 'Lo siento, ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Se establece el mensaje de bienvenida al cargar el componente.
    useEffect(() => {
        setMessages([
            {
                role: 'model',
                text: '¡Hola! 👋 Soy ANI, tu asistente de turismo para Nocaima. Puedo darte una recomendación personalizada o puedes escribirme tu pregunta directamente. ¿Qué te gustaría hacer? 😊',
            },
        ]);
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setShowInterestButtons(false);
        await getAndSetResponse(newMessages);
    };

    const handleInterestSelect = async (interest: string) => {
        if (isLoading) return;
        
        const messageText = `Me interesa la ${interest}.`;
        const userMessage: Message = { role: 'user', text: messageText };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setShowInterestButtons(false);
        await getAndSetResponse(newMessages);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl">
            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
                {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}
                 {messages.length === 1 && showInterestButtons && !isLoading && (
                    <InterestSelector onSelect={handleInterestSelect} />
                )}
                {isLoading && <TypingIndicator />}
                {error && <div className="text-red-500 text-center p-2">{error}</div>}
            </div>
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-3xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsEmergencyModalOpen(true)}
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-red-500 text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        aria-label="Teléfonos de Emergencia"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v6h-2V4zm2 8a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                         </svg>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregúntale algo a ANI..."
                        className="flex-1 w-full px-4 py-3 bg-white border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-sky-500 text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </form>
            </div>
            <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} />
        </div>
    );
};

export default Chat;
