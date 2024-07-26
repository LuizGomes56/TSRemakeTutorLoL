export const EndPoint = "http://localhost:3000";
export const Style = {
    damages: {
        physical: "text-orange-600",
        magic: "text-cyan-500",
        true: "text-white",
        mixed: "text-purple-700"
    }
}
export const spell = (id: string) => `${EndPoint}/img/spell/${id}.png`;
export const item = (id: string) => `${EndPoint}/img/item/${id}.png`;
export const rune = (id: string) => `${EndPoint}/img/rune/${id}.png`;
export const champion = (id: string) => `${EndPoint}/img/champion/${id}.png`;
export const symbol = (id: string) => `${EndPoint}/img/symbol/${id}.png`;