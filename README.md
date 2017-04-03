# Boston Neighborhood Mapping Project
Web application for viewing and interacting with gentrification data in the greater boston area.
- see project structure for application requirements


TODO:
- optimize the opacity inverses upon legend use for fails
- add in download PDF/PNG
- consider adding in compiled criteria statements for filters and pass/fail visualizations
- consider adding 'change' to year range labels
- have legend title wrap after a certain number of characters
- take a look at percentages in the normailzer and make sure the "errors" aren't on our end
- consider zooming in on new visualization/filter choice;
- turn the add filter button into a SVG (is mis-centered in other browsers);
- standardize the scrolling on sidebar panes
- add map extent into memory?
- map memory selection UI:
  - make save transition to green
- change the legend title on pass/fail, seems to be labeling inconsistently and needs to be troubleshot
- add tip to create subrange on the visualization settings
- try to add an animation on legend update (since it gets finessed so much)
- try to find a way to disassociate clicks from processing lag
- rounding is off between multiple parts of the app including but not limited to the class slider tooltips and the legend
- classes slider: 
  - find a way to make slider colors that are light popout on classes slider
  - add in min/max as marks
  - spread out mark values and center the slider (will also make room for tooltips)
  - make a function that sweeps, finds tooltips and closes them -- they are being left over from hovers in buggy ways
- CLOSE POPUP BOTTON HIGHLY OFF-CENTER IN INTERNET EXPLORER

TODO FROM FEEDBACK:
- See if base map can clearly label city/town boundary lines
- have them create some map selections

EXTRAS:
- add in a landing page
- ESL Options (Spanish)
- See if we can come up with a way to show transit stops and a tract’s distance from the nearest rapid transit stop.

COMPETITORS:
- http://www.socialexplorer.com/