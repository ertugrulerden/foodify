import { PopularRestaurants } from "@/lib/data/homepage";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image"

const RestaurantCard = ({ name, location, image, platforms, rating, fee }: PopularRestaurants) => {
  return (
	<Card size="sm" className="shrink-0 w-64">
		<div className="relative h-36 bg-muted overflow-hidden rounded-t-xl">
			<Image src={image} alt={name} fill className="object-cover"/>
		</div>

		<CardHeader>
			<CardTitle className="">{name}</CardTitle>
			<CardDescription>
			{rating && <>★ {rating}</>}
			{rating && fee && <>  •  </>}
			{fee && <>{fee} TL delivery</>}
			</CardDescription>
		</CardHeader>

		<CardContent className="flex flex-wrap gap-1.5">
			{platforms.map(p => (
				<Badge key={p}> {p} </Badge>
			))}
		</CardContent>
	</Card>
  );
};

export default RestaurantCard;
