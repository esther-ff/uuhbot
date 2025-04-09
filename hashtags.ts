const hashtagArray = [
  "Rats",
  "kindergarten",
  "estrogen4life",
  "freediddy",
  "6axethrows",
  "sadaniswoke",
  "foraging",
  "aycarmela",
  "56femboy",
  "Maćka",
  "Wistralis",
  "puppygirl",
  "catboy",
  "Cats",
];

export function appendHashtag(msg: string, f: () => boolean): string {
  // called function will give us a boolean whether to append 
  // the hash or no.
  let doHashtag = f();

  if (doHashtag) {
    let newMsg = msg + " #" + getRandomHashtag();
    return newMsg
  } else {
    return msg;
  }
}

// Returns a random hashtag from the array.
function getRandomHashtag(): string {
  let length = hashtagArray.length;
  let index = Math.floor(Math.random() * length);
  return hashtagArray[index]
}

