import $ from 'jquery';
import io from 'socket.io-client';

var socket = io.connect();

$(document).keypress(function (event) {
    //socket.emit('pressed', event);
});