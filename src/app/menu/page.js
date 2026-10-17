import MenuView from "@/components/menu/MenuView";

export const metadata = {
  title: "Menu · KhanaGhor",
};

export default async function MenuPage({ searchParams }) {
  const { cuisine = "all", q = "" } = await searchParams;
  // key resets the filter state when the URL query changes (e.g. navbar links)
  return <MenuView key={`${cuisine}|${q}`} initialCuisine={cuisine} initialQuery={q} />;
}
