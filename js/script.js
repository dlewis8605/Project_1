$(document).ready(function() {
    // jQuery Component 1: Sticky Navbar on scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm bg-dark');
        } else {
            $('.navbar').removeClass('shadow-sm bg-dark');
        }
    });

    // jQuery Component 2: AJAX Loading of Locations
    if ($('#locations-ajax-container').length > 0) {
        $.ajax({
            url: 'data/locations.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                let htmlContent = '<ul class="list-unstyled row">';
                $.each(data.locations, function(index, location) {
                    htmlContent += '<li class="col-md-6 mb-3"><i class="fas fa-map-marker-alt text-info mr-2"></i><strong>' + location.city + '</strong><br><small>' + location.address + '</small></li>';
                });
                htmlContent += '</ul>';
                $('#locations-ajax-container').html(htmlContent);
            },
            error: function() {
                $('#locations-ajax-container').html('<p class="text-danger">Failed to load locations.</p>');
            }
        });
    }

    // jQuery Component 3: Sign In / Register Modal Logic
    const signInModalHtml = `
    <div class="lightbox-overlay" id="signInLightbox">
        <div class="lightbox-content" style="max-width: 400px;">
            <button class="lightbox-close" id="closeSignInLightbox" aria-label="Close">&times;</button>
            <h3 class="heading-deco mb-4" style="color: var(--color-dark-slate);">Sign In</h3>
            <div class="form-group text-left" style="margin-bottom: 1rem;">
                <label for="signInEmail" style="font-weight: 500;">Email</label>
                <input type="email" id="signInEmail" class="form-control form-control-splashes" placeholder="user@example.com">
            </div>
            <div class="form-group text-left" style="margin-bottom: 0.5rem;">
                <label for="signInPassword" style="font-weight: 500;">Password</label>
                <input type="password" id="signInPassword" class="form-control form-control-splashes" placeholder="••••••••">
            </div>
            <div class="text-left mb-4">
                <a href="contact.html" id="forgotPasswordLink" style="font-size: 0.9rem; color: var(--color-cyan);">Forgot Password?</a>
            </div>
            <div class="d-flex flex-column" style="gap: 15px;">
                <button id="signInBtn" class="btn w-100" style="background-color: var(--color-cyan); border-color: var(--color-cyan); color: #fff; border-radius: 20px; font-weight: bold; padding: 10px 30px;" disabled>Sign In</button>
                <button id="signUpBtn" class="btn bg-white w-100" style="border: 2px solid var(--color-cyan); color: var(--color-cyan); border-radius: 20px; font-weight: bold; padding: 10px 30px;">Sign Up</button>
            </div>
        </div>
    </div>
    `;
    $('body').append(signInModalHtml);

    // Filter all links with Register / Sign In text to open the modal
    $('a[href="contact.html"]').filter(function() {
        return $(this).text().trim() === 'Register / Sign In';
    }).on('click', function(e) {
        e.preventDefault();
        $('#signInLightbox').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    // Close logic
    $('#closeSignInLightbox, #signInLightbox').on('click', function(e) {
        if (e.target === this) {
            $('#signInLightbox').removeClass('active');
            $('body').css('overflow', '');
        }
    });

    // Forgot password redirects
    $('#forgotPasswordLink').on('click', function() {
        // Just let the default link behavior happen after closing
        $('#signInLightbox').removeClass('active');
        $('body').css('overflow', '');
    });

    // Validation logic for Sign In button
    function checkSignInValid() {
        const email = $('#signInEmail').val().trim();
        const pwd = $('#signInPassword').val();
        // Check for basic email shape
        const hasEmail = email.length > 0 && email.includes('@') && email.includes('.');
        const hasPwd = pwd.length >= 8;
        
        if (hasEmail && hasPwd) {
            $('#signInBtn').removeAttr('disabled');
        } else {
            $('#signInBtn').prop('disabled', true);
        }
    }
    $('#signInEmail, #signInPassword').on('input', checkSignInValid);

});

// Vue Component: Interactive Tuition Calculator
if (document.getElementById('vue-calculator-app')) {
    new Vue({
        el: '#vue-calculator-app',
        data: {
            selectedLessonType: 'private',
            sessionsPerWeek: 1,
            weeksOfLessons: 4,
            baseRates: {
                private: 45,
                semi: 35,
                parent: 25,
                adult: 40
            }
        },
        computed: {
            totalCost: function() {
                const rate = this.baseRates[this.selectedLessonType];
                return (rate * this.sessionsPerWeek * this.weeksOfLessons).toFixed(2);
            }
        }
    });
}
