export function MessageList({ conversations, currentUserId }: any) {
  return (
    <div>
      {conversations.map((msg: any) => (
        <div key={msg.id} className="border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="font-bold text-gray-900 dark:text-white">
            {msg.sender.displayName} → {msg.receiver.displayName}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{msg.content}</p>
        </div>
      ))}
    </div>
  )
}