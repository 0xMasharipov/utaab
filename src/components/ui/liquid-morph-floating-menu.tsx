import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

interface LiquidMorphFloatingMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  triggerLabel: string;
  closeLabel: string;
  panelLabel: string;
  children: ReactNode;
}

export const LiquidMorphFloatingMenu = forwardRef<HTMLDivElement, LiquidMorphFloatingMenuProps>(
  ({ isOpen, onToggle, triggerLabel, closeLabel, panelLabel, children }, ref) => (
    <div className="utaab-liquid-menu">
      <motion.div
        className="utaab-liquid-menu__trigger-wrap"
        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.88 : 1 }}
        transition={{ duration: 0.22, ease }}
        aria-hidden={isOpen}
      >
        <Button
          type="button"
          variant="ghost"
          className="utaab-menu-trigger"
          onClick={onToggle}
          aria-label={triggerLabel}
          aria-expanded={isOpen}
          aria-controls="nav-overlay"
          tabIndex={isOpen ? -1 : 0}
        >
          <span className="utaab-menu-grid" aria-hidden="true" />
          <span>{triggerLabel.toUpperCase()}</span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="nav-overlay"
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={panelLabel}
            className="utaab-liquid-panel"
            initial={{ opacity: 0, width: 112, height: 48, borderRadius: 4 }}
            animate={{ opacity: 1, width: 'var(--liquid-menu-width)', height: 'var(--liquid-menu-height)', borderRadius: 8 }}
            exit={{ opacity: 0, width: 112, height: 48, borderRadius: 4 }}
            transition={{ duration: 0.7, ease, height: { duration: 0.62, ease } }}
          >
            <motion.div
              className="utaab-liquid-panel__wash"
              initial={{ scale: 0, y: '45%' }}
              animate={{ scale: 1, y: '5%' }}
              exit={{ scale: 0, y: '45%' }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
            />
            <motion.div
              className="utaab-liquid-panel__content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, delay: 0.28, ease }}
            >
              {children}
            </motion.div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="utaab-liquid-panel__toggle"
              onClick={onToggle}
              aria-label={closeLabel}
            >
              <span className="utaab-liquid-panel__line utaab-liquid-panel__line--a" />
              <span className="utaab-liquid-panel__line utaab-liquid-panel__line--b" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ),
);

LiquidMorphFloatingMenu.displayName = 'LiquidMorphFloatingMenu';