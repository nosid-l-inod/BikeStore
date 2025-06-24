document.addEventListener('DOMContentLoaded', () => {
    // Dados simulados para métricas
    const metrics = {
        sales: [8500, 9000, 9500, 10000, 11000, 12500],
        customers: [30, 35, 40, 42, 44, 45],
        traffic: [800, 900, 1000, 1100, 1150, 1200]
    };

    // Gráfico de Vendas Mensais
    new Chart(document.getElementById('salesChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Vendas (€)',
                data: metrics.sales,
                borderColor: '#1e40af',
                fill: false
            }]
        },
        options: { responsive: true }
    });

    // Gráfico de Novos Clientes
    new Chart(document.getElementById('customersChart'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [{
                label: 'Novos Clientes',
                data: metrics.customers,
                backgroundColor: '#1e40af'
            }]
        },
        options: { responsive: true }
    });

    // Gráfico de Tráfego Diário
    new Chart(document.getElementById('trafficChart'), {
        type: 'line',
        data: {
            labels: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6'],
            datasets: [{
                label: 'Tráfego Diário',
                data: metrics.traffic,
                borderColor: '#15803d',
                fill: false
            }]
        },
        options: { responsive: true }
    });

    // Exportar Métricas
    window.exportMetrics = function() {
        const csv = [
            'Mês,Vendas (€),Novos Clientes,Tráfego Diário',
            ...metrics.sales.map((sale, i) => `${['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'][i]},${sale},${metrics.customers[i]},${metrics.traffic[i]}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'metrics.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Gestão de Eventos
    const eventForm = document.getElementById('event-form');
    const eventList = document.getElementById('event-list');
    let events = JSON.parse(localStorage.getItem('events')) || [];

    function renderEvents() {
        eventList.innerHTML = events.map((event, index) => `
            <li>
                <span>${event.title} - ${event.date} - ${event.location}</span>
                <button onclick="removeEvent(${index})">Remover</button>
            </li>
        `).join('');
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEvent = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            location: document.getElementById('event-location').value,
            description: document.getElementById('event-description').value,
            image: document.getElementById('event-image').value
        };
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        renderEvents();
        eventForm.reset();
        alert('Evento adicionado com sucesso!');
    });

    window.removeEvent = function(index) {
        if (confirm('Tem certeza que deseja remover este evento?')) {
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            renderEvents();
        }
    };

    renderEvents();
});