import '../../../css/addModal.css';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Ticket from '../Ticket';
import createRequest from '../../createRequestFunc';

export default class AddModal {
    constructor(parentEl, ticketsContainer, noTicketSpan) {
        this.parentEl = parentEl;
        this.ticketsContainer = ticketsContainer;
        this.noTicketSpan = noTicketSpan;
    }
    static getAddModalMarkup() {
        return `
            <div class="modal modal-add">
                <form class="modal-add-form">
                    <h3 class="modal-title">Добавить тикет</h3>
                    <div class="inputs-wrapper">
                        <label class="input-name">Краткое описание
                            <input class="ticket-name-input" type="text" required></input>
                        </label>

                        <label class="input-description">Подробное описание
                            <input class="ticket-description-input" type="text" required></input>
                        </label>
                    </div>
                    <div class="buttons-wrapper">
                        <button type="button" class="close-modal-btn">Отмена</button>
                        <button type="submit" class="ok-modal-btn">Ок</button>
                    </div>
                </form>
            </div>
        `
    }

    bindToDOM() {
        const markup = AddModal.getAddModalMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', markup);
        this.addListeners();
    }

    addListeners() {
        const modalContainer = this.parentEl.querySelector('.modal-add');
        const form = modalContainer.querySelector('.modal-add-form');
        const ticketNameEl = form.querySelector('.ticket-name-input');
        const ticketDescriptionEl = form.querySelector('.ticket-description-input');
        const closeBtn = modalContainer.querySelector('.close-modal-btn');

        closeBtn.addEventListener('click', () => this.closeModal(modalContainer)); 
        form.addEventListener('submit', (e) => this.submitForm(e, ticketNameEl, ticketDescriptionEl, modalContainer));
    }

    closeModal(container) {
        console.log('Закрывается модальное окно добавления тикета')
        container.remove();
    }

    submitForm(event, ticketNameEl, ticketDescriptionEl, modalContainer) {
        event.preventDefault();

        let ticketName = ticketNameEl.value;
        let ticketDescription = ticketDescriptionEl.value;
        const created = dayjs().format('DD.MM.YYYY HH:mm');

        createRequest('POST', 'http://localhost:7070/?method=createTicket', {ticketName, ticketDescription, created})
        .then(res => AddModal.addTicketToContainer(res.ticketName, res.ticketDescription, res.created, res.generatedId, this.ticketsContainer, this.noTicketSpan))
        .catch(err => console.error(err, 'Ошибка при отправке формы'));

        this.closeModal(modalContainer);

    }
    
    static addTicketToContainer(name, description, date, id, ticketsContainer, noTicketSpan) {
        const ticket = new Ticket(name, description, date, id);
        const ticketMarkup = ticket.getTicketMarkup();
        
        ticketsContainer.insertAdjacentHTML('beforeend', ticketMarkup);
        
        ticketsContainer.classList.add('active');
        noTicketSpan.classList.add('disabled');
    }
}