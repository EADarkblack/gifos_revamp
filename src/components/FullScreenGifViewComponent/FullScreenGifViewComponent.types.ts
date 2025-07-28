export type GifData = {
  id: string;
  title: string;
  alt_text: string;
  username: string;
  images: { downsized_medium: { url: string }; original: { url: string } };
};

export type FullScreenGifViewComponentProps = {
  mode: "favorites" | "my-gifos";
};
