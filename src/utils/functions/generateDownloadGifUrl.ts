export const generateDownloadGifUrl = async (image: string, title: string) => {
  const a = document.createElement("a");
  const response = await fetch(`${image}`);
  const file = await response.blob();

  a.download = `${title}`;
  a.href = window.URL.createObjectURL(file);
  a.dataset.downloadurl = ["application/octet-stream", a.download, a.href].join(
    ":"
  );
  a.click();
};
