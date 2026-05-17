
const ScrollableRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {children}
    </div>
  )
}

export default ScrollableRow
