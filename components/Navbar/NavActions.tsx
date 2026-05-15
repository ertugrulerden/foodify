import { ShoppingCart, Star, Bell, Languages } from "lucide-react";

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

        <div id="language">
          <Languages/>
        </div>
    </div>
  )
}

export default NavActions
