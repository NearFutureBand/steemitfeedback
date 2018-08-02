# Golos Feedback

GolosFeedback is a microservise on the blockchain Golos that allows you to manage all the messages with ideas, offers and problems from your users. It can be inserted in any webpage into a modal window so it can work everywhere.

## [golosfeedback.com](https://golosfeedback.com/)


## Getting started


### Installing

To inject GolosFeedback to your webpage you need to make only three simple steps:
1. Add JavaScript in your HTML-page: 
```
<script src="https://golosfeedback.com/js/inject.js"></script>
```
2. Place the button:
```
<button type="button" data-toggle="modal" data-target=".modal-lg-golos-feedback">Open Golos Feedback</button>
```
3. Set up a standard bootstrap modal window:
```
<div class="modal fade modal-lg-golos-feedback" tabindex="-1" role="dialog" aria-labelledby="GolosFeedback" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content golos-feedback-container">
            
        </div>
    </div>
</div>
```
This instruction you also can see on the full version of [GolosFeedback](https://golosfeedback.com/) by pressing the button *integration*


## Deployment

Once you set up the modal window with the microservice all your clients, users, advisers and you can start using GolosFeedback. There is no need to download something to your storage or activate any licenses or email boxes.

## Capabilities

### Feedbacks

A feedback is the main unit in the microservice. Every note has some information from one among your users. All the most fresh feedbacks appeared in the GolosFeedback window when you've opened it. Add new feedback determinig it to the one of the four categories: question, problem, idea, thank. This list will be growing in future. You can see all the added feedbacks already in the main screen. Use tabs below the navigation bar to sort the feedbacks.

### Comments

To answer any feedback open the form for adding a comment by pressing the button in the bottom left corner of the certain feedback. Number in this button shows how many answers this feedback has. Use the same button to come back to the list of feedbacks.

### Voting

Any feedback or comment could be voted by pressing like/dislike buttons in the right part of a post. 

## Built With

* [Golos.js](https://github.com/GolosChain/golos-js) - the JavaScript API for Golos blockchain;
* [Bootstrap](https://github.com/twbs/bootstrap) - the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web;
* [SweetAlert2](https://github.com/limonte/sweetalert2) - a beautiful, responsive, customizable, accessible replacement for JavaScript's popup boxes.
* [Moment.js](https://momentjs.com/) - Parse, validate, manipulate, and display dates and times in JavaScript.
* [I18next](https://www.i18next.com) -  is an internationalization-framework written in and for JavaScript;
* [IcoMoon-Free](https://github.com/Keyamoon/IcoMoon-Free) - IcoMoon-Free is a free vector icon pack;
* [Flag-icon-css](https://github.com/lipis/flag-icon-css) -  A collection of all country flags in SVG;
* [findAndReplaceDOMText](https://github.com/padolsey/findAndReplaceDOMText) - searches for regular expression matches in a given DOM node and replaces or wraps each match with a node or piece of text that you can specify.

## Authors

Pavel Belyakov - Front End - [profile](https://github.com/NearFutureBand)

See also the list of [contributors](https://github.com/NearFutureBand/golosfeedback/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/NearFutureBand/golosfeedback/blob/master/LICENSE) file for details
