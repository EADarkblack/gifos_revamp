export type GifCardComponentProps = {
  gifData: {
    id: string;
    alt_text: string;
    username: string;
    title: string;
    images: {
      downsized_medium: {
        url: string;
      };
      original: {
        url: string;
      };
    };
  };
  mode: "search" | "favorites" | "my-gifos";
};
