import TrackView from "@/components/cart/TrackView";

export const metadata = { title: "Track order · KhanaGhor" };

export default async function TrackPage({ searchParams }) {
  const { id = "", new: isNew } = await searchParams;
  return <TrackView key={id} orderId={id} justPlaced={isNew === "1"} />;
}
