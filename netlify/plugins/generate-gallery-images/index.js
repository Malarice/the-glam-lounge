import fs from "fs";
import path from "path";

export const onPreBuild = () => {
  const folder = "assets/gallery";
  const files = fs.readdirSync(folder);

  const images = files.filter(file =>
    file.match(/\.(jpg|jpeg|png|webp|gif)$/i)
  );

  fs.writeFileSync(
    "gallery.json",
    JSON.stringify(images, null, 2)
  );

  console.log("Generated gallery.json with", images.length, "images");
};

