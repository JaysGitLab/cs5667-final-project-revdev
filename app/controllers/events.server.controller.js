const Event = require('mongoose').model('Event');

function getErrorMessage(err) {
  let message = '';

  if (err.code) {
    switch (err.code) {

