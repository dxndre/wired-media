jQuery(document).ready(function($) {
    var form = $('.quickcheck-form');
    var input = form.find('input[name="wpqc_text"]');
    var btn = form.find('button[type="submit"]');
    var charCount = form.find('.char-count');
    var countNumber = form.find('.count-number');
    var maxLength = parseInt(input.attr('maxlength'), 10);
    var minLength = 3;

    // Initial state
    btn.addClass('disabled').prop('disabled', true);
    countNumber.text(0);
    charCount.addClass('too-short');

    // Listen for input changes
    input.on('input', function() {
        var len = $(this).val().length;

        // Update only the number
        countNumber.text(len);

        // Toggle "too-short" class on parent span
        if (len < minLength) {
            charCount.addClass('too-short');
            btn.addClass('disabled').prop('disabled', true);
        } else {
            charCount.removeClass('too-short');
            btn.removeClass('disabled').prop('disabled', false);
        }
    });
});
