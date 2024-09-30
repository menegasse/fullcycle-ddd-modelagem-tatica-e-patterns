import EventInterface from "./event.interface";

// 1. Nossa interface de handler vai sempre precisar expecificar o tipo EventInterface
//    que ela está trabalhando, caso não seja expecificado o padrão para todas as 
//    EventHandlerInterface será o próprio EventInterface;
//
// 2. Trocando em miudos, toda vez que implementarmos uma classe de  EventHandler
//    precisamos especificar o evento, caso contrario ele vai utilizar a interface
//    padrão para resolver o evento;
export default interface EventHandlerInterface<T extends EventInterface=EventInterface>{
    handler(event: T): void;
}