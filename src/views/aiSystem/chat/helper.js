// import moment from "moment"

// function getChatHistoryDayStrategy(chatHistory, idx) {
//   // 当天
//   const today = moment().startOf('day')
//   const filtered = []
//   for (let i = idx - 1; i >= 0; i--) {
//     if (moment(chatHistory[i].timestamp).startOf('day').isBefore(today)) break
//     filtered.push({
//       role: chatHistory[i].inversion ? 'assistant' : 'user',
//       content: chatHistory[i].text,
//     })
//   }

//   return filtered.reverse()
// }

function getChatHistoryRecentStrategy(chatHistory, idx) {
  // 最近20条
  return chatHistory.slice((idx - 20 || 0), idx).map(v => ({
    role: v.inversion ? 'assistant' : 'user',
    content: v.text,
  }))
}

export default function getChatHistory(chatHistory, idx) {
  return getChatHistoryRecentStrategy(chatHistory, idx)
}