
export function gettitle (title: { [key: string]: string }) {
  return title.userPreferred && title.userPreferred !== title.english && title.userPreferred.length > 14 ? title.english || title.romaji : title.romaji || title.english
}