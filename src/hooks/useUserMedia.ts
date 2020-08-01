export const useUserMedia = () => {
  return navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
        return stream;
    })
    .catch((error) => {
      throw new Error(error)
    });
};
