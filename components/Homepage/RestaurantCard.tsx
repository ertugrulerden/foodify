import { PopularRestaurants } from "@/lib/data/homepage";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image"

const RestaurantCard = ({ restaurantName, productName, location, image, platforms, averageRating }:SearchResult[] ) => {
  return (
	<Card size="sm" className="shrink-0 w-64">
		<div className="relative h-36 bg-muted overflow-hidden rounded-t-xl">
			<Image src={image} alt={name} fill className="object-cover"/>
		</div>
	
		<CardHeader>
			<CardTitle className="">{restaurantName} - {productName}</CardTitle>
			<CardDescription>
			{averageRating && <>★ {averageRating}</>}
			{location && <>{location}</>}
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
