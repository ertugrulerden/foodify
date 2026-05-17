import { getAllPlatforms } from "@/lib/data/queries"
import { PlatformsClient } from "./platforms-client"

const Page = () => {
  const platforms = getAllPlatforms()
  return <PlatformsClient data={platforms} />
}

export default Page
