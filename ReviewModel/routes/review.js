const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateReview } = require('../middleware');
const Review = require('../models/review');

router.get('/', catchAsync(async (req, res) => {
    const reviews = await Review.find({});
    res.render('review/index', { reviews })  
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('review/new');
})


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    req.flash('success', ' Successfully added review !');
    res.redirect('/review')
}))

router.get('/:id', catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id).populate('author');
    console.log(review);
    
    if (!review) {
        req.flash('error', 'Cannot find the review!');
        return res.redirect('/review');
    }
    res.render('review/show', { review });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(req.params.id)
    if (!review) {
        req.flash('error', 'Cannot find the review!');
        return res.redirect('/review');
    }
    res.render('review/edit', { review });
}))

router.put('/:id', isLoggedIn, isAuthor, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
    req.flash('success', 'Successfully updated review!');
    res.redirect(`/review/${review._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review')
    res.redirect('/review');
}));

module.exports = router;