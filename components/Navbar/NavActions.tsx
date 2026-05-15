import { ShoppingCart, Star, Bell } from "lucide-react";

const NavActions = () => {
  return (
    <div id="action-btns" className="flex gap-3">
        <div id="favorites">
          <Star/>
        </div>

        <div id="cart">
          <ShoppingCart/>
        </div>

        <div id="notifications">
          <Bell/>
        </div>
    </div>
  )
}

export default NavActions
