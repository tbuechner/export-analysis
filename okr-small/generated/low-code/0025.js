var lang = cplace.utils().getCurrentUser().getUserLanguage();

var messages = {
  message: {
    en: '<p style="font-size: 14px; margin-left: 5px;color:#343C4C">Enter your progress and submit your Key Result Updates. </p>',
    de: 'Tragen sie Ihren Fortschritt ein und reichen Sie Ihr Key Result Updates ein. '
  }
}

return messages.message[lang]