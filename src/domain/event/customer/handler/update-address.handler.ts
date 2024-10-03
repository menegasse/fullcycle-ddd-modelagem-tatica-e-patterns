import EventHandlerInterface from "../../shared/event-handler.interface";
import AddressUpdateEvent from "../address-update.event"

export default class EnviaConsoleLogHandler implements EventHandlerInterface<AddressUpdateEvent>{
    handler(event: AddressUpdateEvent): void {
        const {id, name, address} = event.eventData;

        console.log(`Endereço do client: ${id}, ${name} alterado para: ${address}`);
    }
}