jQuery(document).ready(function($) {
    var form = $('.quickcheck-form');
    var input = form.find('input[name="wpqc_text"]');
    var btn = form.find('button[type="submit"]');
    var charCount = form.find('.char-count');
    var maxLength = parseInt(input.attr('maxlength'), 10);
    var minLength = 3;

    // Initial state
    btn.addClass('disabled').prop('disabled', true);
    charCount.text('0').addClass('too-short');

    // Listen for input changes
    input.on('input', function() {
        var val = $(this).val();
        var len = val.length;

        // Update character count
        charCount.text(len);

        // Toggle "too-short" class based on min length
        if (len < minLength) {
            charCount.addClass('too-short');
            btn.addClass('disabled').prop('disabled', true);
        } else {
            charCount.removeClass('too-short');
            btn.removeClass('disabled').prop('disabled', false);
        }
    });
});
