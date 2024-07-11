export const isCloseToBottom = (element) => {
  const paddingToBottom = 10;
  return element.scrollHeight - element.scrollTop <= element.clientHeight + paddingToBottom;
};
