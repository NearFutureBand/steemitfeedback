# Golos Feedback

GolosFeedback is a microservise on the blockchain Golos that allows you to manage all the messages with ideas, offers and problems from your users. It can be inserted in any webpage into a modal window so it can work everywhere.

## [golosfeedback.com](https://golosfeedback.com/)

We use:
* [Golos.js](https://github.com/GolosChain/golos-js) - the JavaScript API for Golos blockchain;
* [Bootstrap](https://github.com/twbs/bootstrap) - the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web;
* [SweetAlert2](https://github.com/limonte/sweetalert2) - a beautiful, responsive, customizable, accessible replacement for JavaScript's popup boxes.


## Getting started


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

## Connection with other GolosApps
