import HelpDesk from "./Components/HelpDesk";
import AddModal from "./Components/modals/addModal";
import createRequest from "./createRequestFunc";

const container = document.querySelector('.container');

const helpDesk = new HelpDesk(container);
helpDesk.bindToDOM();


createRequest('GET', 'http://localhost:7070/?method=allTickets')
.then(data => {
    if (data.status === false) {
        console.log('No tickets on server');
        return;
    }
    const ticketsContainer = document.querySelector('.tickets-container');
    const noTicketSpan = document.querySelector('.no-tickets');
    data.tickets.forEach(ticket => {
        AddModal.addTicketToContainer(
            ticket.ticketName, 
            ticket.ticketDescription,  
            ticket.created,
            ticket.generatedId,
            ticketsContainer,
            noTicketSpan
        )
    })
}) 

