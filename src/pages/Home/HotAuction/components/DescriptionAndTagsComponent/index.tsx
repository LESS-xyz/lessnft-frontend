import { FC, useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Text } from 'components';
import copyToClipboard from 'copy-to-clipboard';
import styles from './styles.module.scss';
import { ITag } from '../../../../../typings';
import { Cursor, IconLock, IconUnlock, IconCopy } from 'assets/img';

type Props = {
  className?: string;
  tags: ITag[];
  body: string;
  digitalKey?: string;
  isUserCanSeeUnlockableContent?: boolean;
};

const DescriptionAndTagsComponent: FC<Props> = ({
  className,
  tags,
  body,
  digitalKey,
  isUserCanSeeUnlockableContent,
}) => {
  const textRef = useRef<any>(null);
  const [showHover, setShowHover] = useState(true);
  const [isUnlockOpened, setIsUnlockOpened] = useState(false);
  const [copyContent, setCopyContent] = useState(false);

  const handleUnlock = useCallback(() => {
    setIsUnlockOpened(!isUnlockOpened);
  }, [isUnlockOpened]);

  const handleCopy = (content: string) => {
    copyToClipboard(content);
    setCopyContent(true);
  };

  useEffect(() => {
    if (textRef.current) {
      if (textRef.current.offsetHeight >= 100) {
        setShowHover(true);
      } else {
        setShowHover(false);
      }
    }
  }, [textRef, body]);

  return (
    <div className={className}>
      <div className={styles.descriptionBody} ref={textRef}>
        <div className={`${styles.hoverText} ${showHover && styles.showHoverNotification}`}>
          <Text>Hover to read more</Text>
          <Cursor aria-label="hover" className={styles.cursor} />
        </div>
        <Text>{body}</Text>
      </div>
      {tags.length > 0 && (
        <div className={styles.tagWrapper}>
          <Text size="m" className={styles.tagTitle}>
            Tags:
          </Text>
          {tags.map((tag) => (
            <div className={styles.tag} key={`tag-${tag.title}`}>
              <Text size="s">{`#${tag.title}`}</Text>
            </div>
          ))}
        </div>
      )}

      {isUserCanSeeUnlockableContent && (
        <div className={styles.unlockWrapper}>
          <div
            role="button"
            className={cn(styles.unlock, { [styles.opened]: isUnlockOpened })}
            onClick={isUnlockOpened ? undefined : handleUnlock}
            onKeyDown={() => {}}
            tabIndex={0}
          >
            <div
              role="button"
              className={styles.unlockButton}
              onClick={isUnlockOpened ? handleUnlock : undefined}
              onKeyDown={() => {}}
              tabIndex={0}
            >
              {isUnlockOpened ? <IconUnlock /> : <IconLock />}
              <span>{isUnlockOpened ? 'Hide' : 'Get'} unlockable content</span>
            </div>

            {!!digitalKey && (
              <div className={cn(styles.digitalKey, { [styles.open]: isUnlockOpened })}>
                {digitalKey.length > 100 ? `${digitalKey.slice(0, 100)}...` : digitalKey}
                <div
                  role="button"
                  className={styles.copy}
                  onKeyDown={() => {}}
                  tabIndex={0}
                  onClick={() => handleCopy(digitalKey || '')}
                  onMouseLeave={() => setCopyContent(false)}
                >
                  <IconCopy />
                  <div className={styles.tooltip}>
                    <span className={styles.tooltiptext}>
                      {copyContent ? 'Success!' : 'Copy unlockable content'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DescriptionAndTagsComponent;
