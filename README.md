# Yugify

If you're reading this, it's either because you want to know about the project or more in-depth informatition so as to navigate it better 
(maybe for modification?), so this ReadMe will cover those two interests starting with what the project is. 

#1. This project is a Firefox
addon that allows players to find cards that can find other, specific cards (called searchers), create combos, view combos, and easily 
navigate to another source (Yugipedia) that offers additional information. More abstractly, it's a GUI that communicates with a backend, 
which stores the information previously mentioned in addition to the images of cards.

Setting up this project is simple although its features won't be functional without its backend, which is not included in this repository.
Simply open Firefox, open the Add-ons Manager (its icon is the puzzle piece in the top-most, right-most section of firefox), click the cog 
that appears behind (left to right) the text "Manage Your Extensions" and beneath the add-ons search field. It will have the option to 
"Debug Add-ons." Click it. There will be a section called "Temporary Extensions" with an option "Load Temporary Add-ons." Click it, navigate 
your files to where this project is downloaded, then click this project's "Yugify.js" file. Done!

------------------------------------------------------------------------------------------------
-- Ignore if not interested in modifying (I just like writing) --

#2. More detailed information that can be used with ctrl + f to navigate the project more easily.


The flowchat of what happens is first, the addon pulls from cards.json (this holds all the card info aside from images) to create a list 
of card names that have their indexes as suffixes. This allows them to be searched and have their indexes, which is used for a number of 
functions, to be found simultaneously by matching inputed text to card names. Afterwards, the tool and all its subsections are intialized. 

The tool isn't immediately present because it checks for two conditions. The first is that the variable "previewSection"'s parent's parent's 
(2nd ancestor) has the id "deck_constructor," which means the tool only displays in the deck building mode. The second is that the tool isn't 
being hidden, which can be toggled by clicking the previewSection. The previewSection is the container of the large card that's shown to the 
left whenever a card is hovered (clicking the card's image toggles the tool's display).

Once opened, by clicking the tool's icon, the will be three subsections. The first is a yugipedia link, it doesn't interact with the other 
sections when clicked. Whereas the other sections will modify their datasets to make their "expanded" dataset "true." Css makes them larger 
and reveals their contents once their "expanded" dataset is true. They also give the other sections (those that aren't the clicked section), 
gain a "true" dataset of "retracted," retracting the other sections. 

Many other happenings work as clearly as the above, so I won't focus on them. What I will mention is that the various context menus do not work 
as straightfowardly. Instead of each left-click on cards simply opening their own context menu or so, there are actually only 2 context menus 
that get overrided whenever cards and steps are left-clicked; One of the steps to doing so is calling the function "contextualizeContextMenu," 
so ctrl+f-ing for it is a good lead if a person desires to add more functionality to said context menus as the contextualizeContextMenu is called
in areas where a context menu is overrided and provide a clearer view of what's occuring.

-----------------------------------------------------------------------------------------

QTWBAF (Questions That Would Be Asked Frequently [if this hypothetically saw any use whatsover]):

#1 The tool doesn't always show after I open the site, why?
  Because the tool has to be attached to the previewSection (big card element that holds the tool itself) and said previewSection is not always 
  initialized because the tool may sometimes be created before the previewSection itself. This happens because the tool does not check to see whether 
  the page itself and its children (such as a previewSection) have been created. So, if the tool is created before the previewSection, the tool will 
  not be displayed.
  
#2 Combos and searchers aren't shown while all the cards have the same image, why? 
  These all rely on the backend, so they don't work as ideally intended (or at all) without the backend.
