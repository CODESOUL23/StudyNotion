import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * Animated Section Wrapper Component
 * Wraps content and adds scroll-triggered animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.animation - Animation type: 'fadeUp', 'fadeIn', 'fadeLeft', 'fadeRight', 'scale', 'blur'
 * @param {number} props.delay - Animation delay in ms
 * @param {number} props.duration - Animation duration in ms
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.threshold - Intersection threshold (0-1)
 */
const AnimatedSection = ({
    children,
    animation = 'fadeUp',
    delay = 0,
    duration = 600,
    className = '',
    threshold = 0.1,
    as: Component = 'div',
    ...props
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold });

    // Base styles for all animations
    const baseStyles = {
        transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    };

    // Animation-specific styles
    const animationStyles = {
        fadeUp: {
            initial: {
                opacity: 0,
                transform: 'translateY(40px)',
            },
            visible: {
                opacity: 1,
                transform: 'translateY(0)',
            },
        },
        fadeDown: {
            initial: {
                opacity: 0,
                transform: 'translateY(-40px)',
            },
            visible: {
                opacity: 1,
                transform: 'translateY(0)',
            },
        },
        fadeIn: {
            initial: {
                opacity: 0,
            },
            visible: {
                opacity: 1,
            },
        },
        fadeLeft: {
            initial: {
                opacity: 0,
                transform: 'translateX(-40px)',
            },
            visible: {
                opacity: 1,
                transform: 'translateX(0)',
            },
        },
        fadeRight: {
            initial: {
                opacity: 0,
                transform: 'translateX(40px)',
            },
            visible: {
                opacity: 1,
                transform: 'translateX(0)',
            },
        },
        scale: {
            initial: {
                opacity: 0,
                transform: 'scale(0.9)',
            },
            visible: {
                opacity: 1,
                transform: 'scale(1)',
            },
        },
        blur: {
            initial: {
                opacity: 0,
                filter: 'blur(10px)',
                transform: 'translateY(20px)',
            },
            visible: {
                opacity: 1,
                filter: 'blur(0)',
                transform: 'translateY(0)',
            },
        },
        slideUp: {
            initial: {
                opacity: 0,
                transform: 'translateY(60px)',
            },
            visible: {
                opacity: 1,
                transform: 'translateY(0)',
            },
        },
        zoomIn: {
            initial: {
                opacity: 0,
                transform: 'scale(0.8)',
            },
            visible: {
                opacity: 1,
                transform: 'scale(1)',
            },
        },
    };

    const currentAnimation = animationStyles[animation] || animationStyles.fadeUp;
    const appliedStyles = isVisible ? currentAnimation.visible : currentAnimation.initial;

    return (
        <Component
            ref={ref}
            className={className}
            style={{
                ...baseStyles,
                ...appliedStyles,
            }}
            {...props}
        >
            {children}
        </Component>
    );
};

/**
 * Staggered Animation Container
 * Animates children with staggered delays
 */
export const StaggerContainer = ({
    children,
    animation = 'fadeUp',
    staggerDelay = 100,
    duration = 600,
    className = '',
    threshold = 0.1,
    as: Component = 'div',
    ...props
}) => {
    const { ref, isVisible } = useScrollAnimation({ threshold });

    return (
        <Component ref={ref} className={className} {...props}>
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child;

                const baseStyles = {
                    transition: `all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${index * staggerDelay}ms`,
                };

                const animationStyles = {
                    fadeUp: {
                        initial: { opacity: 0, transform: 'translateY(30px)' },
                        visible: { opacity: 1, transform: 'translateY(0)' },
                    },
                    fadeIn: {
                        initial: { opacity: 0 },
                        visible: { opacity: 1 },
                    },
                    scale: {
                        initial: { opacity: 0, transform: 'scale(0.9)' },
                        visible: { opacity: 1, transform: 'scale(1)' },
                    },
                };

                const currentAnimation = animationStyles[animation] || animationStyles.fadeUp;
                const appliedStyles = isVisible ? currentAnimation.visible : currentAnimation.initial;

                return React.cloneElement(child, {
                    style: {
                        ...child.props.style,
                        ...baseStyles,
                        ...appliedStyles,
                    },
                });
            })}
        </Component>
    );
};

export default AnimatedSection;
