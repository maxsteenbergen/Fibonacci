![alt text](https://raw.githubusercontent.com/maxsteenbergen/Fibonacci/master/img/fibonacci_icon_blue.png "Fibonacci")

Fibonacci
=========
##Flexbox page layout composer

Fibonacci is an offshoot of an internal tool created to let non-developers design page layouts using Flexbox, without having to learn HTML or CSS.
Fibonacci starts with a blank ````<section>```` , which you can then split to your heart's content. It generates both the HTML and CSS needed to recreate the layout in your own pages.

After you've made your horizontal or vertical split, you can then add a new sibling, shrink or expand, give it a fixed width/height, remove or split it again. Remember to add a unit when you enter a fixed width or height!
Once you're happy with the layout, hit the export icons to copy the generated code and paste it wherever you need it in your own code.

Tiny sidenote: Fibonacci is mostly a little sideproject still under development and by no means perfect or bug free. Contributions are highly welcome :)

### Notes
**Q: _The main ````#container```` section is 800*600 px. What's up with that?_**
**A:** The beauty of Flexbox is that it's flexible. Whatever the dimensions of your container or even the viewport, Flexbox adapts automatically. It's completely fluid. So all you need to do is to give the ````#container```` section the dimensions you need, and all child sections made with Fibonacci will resize accordingly.

**Q: _Does Fibonacci only split sections in half?_**
**A:** Only as a starting point. In the Options window, you'll find icons that allow you to grow or shrink each section with increments of 50%. This is standard in the Flexbox spec.

**Q: _What if I want 3 or more equal sections?_**
**A:** Simple. First split the ````#container```` section either horizontally or vertically, so you get two equal sections. Then, instead of splitting each section in half again, hit the _'Add Sibling'_ icon for as many times as you need.


**Q: _Can I mix Flexbox with fixed dimensions?_**
**A:** Absolutely. Once you've made a first split, you can enter a fixed dimension in the Options window. **Be sure to include a unit!** Fibonacci also allows the same method for a section's parent.
Note however, that a section's parent defines what dimension you can assign a fixed width to. Fibonacci is quite opinionated and so by default stretches all sections to fill their respective parent. Small example: if you've split a column in 2, and want to give one of those 2 sections a fixed dimension, you can only enter a fixed height. For a fixed width in this example, Fibonacci provides a second input to edit the parent's dimension.