import createRequest from "../../createRequestFunc";
import '../../../css/changeModal.css';

export default class ChangeModal {
    constructor(ticket) {
        this.ticket = ticket;
    }
    static getChangeModalMarkup(name, description) {
        return `
            <div class="modal modal-change">
                <form class="modal-change-form">
                    <h3 class="modal-title">Изменить тикет</h3>
                    <div class="inputs-wrapper">
                        <label class="input-name">Краткое описание
                            <input class="ticket-name-input" type="text" value="${name}" required></input>
                        </label>

                        <label class="input-description">Подробное описание
                            <input class="ticket-description-input" type="text" value="${description}" required></input>
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

    addListeners() {
        const modalContainer = document.querySelector('.modal-change');
        const form = modalContainer.querySelector('.modal-change-form');
        const closeBtn = modalContainer.querySelector('.close-modal-btn');

        const ticketNameInput = modalContainer.querySelector('.ticket-name-input');
        const ticketDescriptionInput = modalContainer.querySelector('.ticket-description-input');


        closeBtn.addEventListener('click', () => this.closeModal(modalContainer)); 

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const ticketNameEl = this.ticket.querySelector('.ticket-name');
            const ticketDescriptionEl = this.ticket.querySelector('.ticket-description');

            const id = this.ticket.dataset.id;
            const ticketName = ticketNameInput.value.trim();
            const ticketDescription = ticketDescriptionInput.value.trim();

            createRequest('GET', `http://localhost:7070/?method=changeTicket&id=${id}&ticketName=${ticketName}&ticketDescription=${ticketDescription}`)
            .then((ticket) => {
                ticketNameEl.textContent = ticket.ticketName;
                ticketDescriptionEl.textContent = ticket.ticketDescription;
            })
            .catch((err) => console.error(err, 'Невозможно изменить тикет'));

            this.closeModal(modalContainer);
        });
    }

    bindToDOM() {
        const ticketNameEl = this.ticket.querySelector('.ticket-name');
        const ticketDescriptionEl = this.ticket.querySelector('.ticket-description');

        const markup = ChangeModal.getChangeModalMarkup(ticketNameEl.textContent, ticketDescriptionEl.textContent);
        const container = this.ticket.closest('.container');

        container.insertAdjacentHTML('beforeend', markup);
        this.addListeners();
    }

    closeModal(container) {
        container.remove();
    }
}