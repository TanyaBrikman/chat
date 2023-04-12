const min = 1;
const max = 6;
const random = Math.floor(Math.random() * (max - min)) + min;

// Устаналиваем класс в переменную в зависимости от случайного числа
let alertClass;
switch (random) {
    case 1:
        alertClass = 'secondary';
        break;
    case 2:
        alertClass = 'danger';
        break;
    case 3:
        alertClass = 'success';
        break;
    case 4:
        alertClass = 'warning';
        break;
    case 5:
        alertClass = 'info';
        break;
    case 6:
        alertClass = 'light';
        break;
}

$(function () {
    // Включаем socket.io и отслеживаем все подключения
    const socket = io.connect()
    const $name = $('#name')
    const $form = $('#messageForm')
    const $textarea = $('#message')
    const $allMessages = $('#allMessages')

    $form.submit((event) => {
        event.preventDefault()
        socket.emit('send mess',
            {
                name: $name.val(),
                mess: $textarea.val(),
                className: alertClass
            })
        $textarea.val('')
    })

    socket.on('add mess', (data) => {
        $allMessages.append("<div class='alert alert-" + data.className + "'><b>" + data.name + "</b>: " + data.mess + "</div>")
    })
})