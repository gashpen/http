import createRequest from "../../createRequestFunc";
import '../../../css/deleteModal.css';

export default class DeleteModal {
    constructor(ticket, ticketsContainer, noTicketSpan) {
        this.ticket = ticket;
        this.ticketsContainer = ticketsContainer;
        this.noTicketSpan = noTicketSpan;
        this.modalContainer;
    }
    static getDeleteModalMarkup() {
        return `
            <div class="modal modal-delete">
                <h3 class="modal-title">Удалить тикет</h3>
                <p class="modal-delete-warn">Вы действительно хотите удалить тикет? Это действие необратимо</p>
                <div class="btns-wrapper">
                    <button type="btn" class="close-modal-btn">Отмена</button>
                    <button type="btn" class="ok-modal-btn">Ок</button>
                </div>
            </div>
        `
    }

    addListeners() {
        this.modalContainer = document.querySelector('.modal-delete');
        const closeBtn = this.modalContainer.querySelector('.close-modal-btn');
        const okBtn = this.modalContainer.querySelector('.ok-modal-btn');

        closeBtn.addEventListener('click', () => this.closeModal(this.modalContainer)); 
        okBtn.addEventListener('click', () => this.delete(this.ticket));
    }

    bindToDOM() {
        const markup = DeleteModal.getDeleteModalMarkup();
        const container = this.ticket.closest('.container');
        
        container.insertAdjacentHTML('beforeend', markup);
        this.addListeners(); 
    }

    delete(ticket) {
        const id = ticket.dataset.id;
        createRequest('GET', `http://localhost:7070/?method=deleteTicket&id=${id}`)
        .then(ticket.remove())
        .catch(err => console.log(err, 'Ticket was not deleted'));

        if (!this.ticketsContainer.children.length) {
            this.noTicketSpan.classList.remove('disabled');
        }
        this.closeModal(this.modalContainer);
    }

    closeModal(container) {
        container.remove();
    }
}