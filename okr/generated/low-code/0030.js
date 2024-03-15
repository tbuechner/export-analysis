var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  message: {
    en: '<p style="font-size: 14px; margin-left: 10px;color:#343C4C">Enter your progress and submit your Key Result Update. </p>',
    de: 'Tragen sie Ihren Fortschritt ein und reichen Sie Ihr Key Result Update ein. '
  }
}

return messages.message[lang]