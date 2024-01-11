import createRequest from '../createRequestFunc';
import Ticket from './Ticket';
import '../../css/helpdesk.css';
import AddModal from "./modals/addModal";

export default class HelpDesk {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.ticketsContainer;
        this.noTicketSpan;
    }
    static getHelpDeskMarkup() {
        return `
            <div class="wrapper">
                <button type="button" class="add-btn">
                    <span class="add-btn-text">+</span>
                </button>
                <span class="no-tickets">Нет тикетов</span>
                <div class="tickets-container"></div>
            </div>
        `
    }

    bindToDOM() {
        const markup = HelpDesk.getHelpDeskMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', markup);
        this.ticketsContainer = this.parentEl.querySelector('.tickets-container');
        this.noTicketSpan = this.parentEl.querySelector('.no-tickets');

        this.addListeners();
    }
    
    addListeners() {
        const addBtnEl = this.parentEl.querySelector('.add-btn');

        this.ticketsContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (
                !target.classList.contains('status') 
                && !target.classList.contains('ticket-change') 
                && !target.classList.contains ('ticket-delete')
                && !target.classList.contains('ticket-created-date')
                && target.closest('.ticket-wrapper')
                ) {
                const ticketEl = target.closest('.ticket-wrapper');
                const descriptionEl = ticketEl.querySelector('.ticket-description');
                descriptionEl.classList.toggle('active');
            }

            if (target.classList.contains('ticket-delete')) {
                this.closeAllModals();
                const ticketEl = target.closest('.ticket-wrapper');
                Ticket.deleteTicket(ticketEl, this.ticketsContainer, this.noTicketSpan);
            }

            if (target.classList.contains('ticket-change')) {
                this.closeAllModals();
                const ticketEl = target.closest('.ticket-wrapper');
                Ticket.changeTicket(ticketEl);
            }

            if (target.classList.contains('status')) {
                const ticket = target.closest('.ticket-wrapper');
                const id = ticket.dataset.id;

                createRequest('GET', `http://localhost:7070/?method=changeStatus&id=${id}`)
                .then(response => {
                    if (response.status) {
                        target.classList.add('status-checked');
                    } else {
                        target.classList.remove('status-checked');
                    }
                })
                target.classList.toggle('status-checked');
            }
        });

        addBtnEl.addEventListener('click', () => this.addModal());
    }

    addModal() {
        const isAddModalOpened = this.parentEl.querySelector('.modal-add');

        if (isAddModalOpened) return;

        const addModal = new AddModal(this.parentEl, this.ticketsContainer, this.noTicketSpan);
        this.closeAllModals();

        addModal.bindToDOM();
    }
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');

        if (!modals.length) return;
        
        [...modals].forEach(modal => modal.remove());
    }
}