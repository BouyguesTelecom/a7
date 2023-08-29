export const giveitback = () =>
  new Promise((resolve) => {
    // Once upon a time was an empty array
    const array = [];

    // Let's give it joy, with a number
    array.push(1);

    // Let's give it delight, with an alphabetical character
    array.push("a");

    // Let's give it perfection, with an emoji
    array.push("🐘");

    // Give it back
    resolve(array.join(" · "));
  });
