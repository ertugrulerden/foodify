import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

interface SearchResultCardProps {
  restaurantName: string
  productName: string
  image: string | null
  address: string
  avgRating: number
  platforms: { name: string; price: number; bestPrice?: boolean }[]
}

export function SearchResultCard({
  restaurantName,
  productName,
  image,
  address,
  avgRating,
  platforms
}: SearchResultCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{restaurantName}</CardTitle>
        <CardDescription>
          {address} {avgRating > 0 && <>• ★ {avgRating}</>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-3">{productName}</p>
        <div className="space-y-2">
          {platforms.map((p, i) => (
            <div key={i} className="flex justify-between items-center">
              <Badge variant="secondary">{p.name}</Badge>
              <span className={p.bestPrice ? "text-green-600 font-bold" : ""}>
                {p.price}TL
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
