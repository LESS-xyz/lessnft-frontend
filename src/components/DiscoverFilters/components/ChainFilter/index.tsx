import { useCallback, useState, VFC } from 'react';

import GroupWrapper from '../GroupWrapper';
import { Text } from 'components';

import styles from './ChainFilter.module.scss';

import { checkMark } from 'assets/img';
import { useMst } from 'store';
import { observer } from 'mobx-react';

interface IProps {
  activeChains: Array<string>;
  setActiveChains: React.Dispatch<React.SetStateAction<string[]>>;
}

const ChainFilter: VFC<IProps> = observer(({ activeChains, setActiveChains }) => {
  const [isOpened, setIsOpened] = useState(true);
  const { networks } = useMst();

  const handleToogleChain = useCallback(
    (chainName: string) => {
      if (activeChains.includes(chainName)) {
        setActiveChains((prev) => prev.filter((el) => el !== chainName));
      } else {
        setActiveChains((prev) => [...prev, chainName]);
      }
    },
    [activeChains, setActiveChains],
  );

  return (
    <GroupWrapper isOpened={isOpened} setIsOpened={() => setIsOpened(!isOpened)} title="Chain">
      <div className={styles.content}>
        {networks.getNetworks.length &&
          networks.getNetworks.map((chain) => {
            const isChainActive = activeChains.includes(chain.name);
            return (
              <button
                type="button"
                onClick={() => handleToogleChain(chain.name)}
                className={styles.chain}
                key={chain.ipfs_icon}
              >
                <div className={styles.icon}>
                  <img
                    src={isChainActive ? checkMark : chain.ipfs_icon}
                    alt={`${chain.name} logo`}
                  />
                </div>
                <Text tag="span" className={styles.name}>
                  {chain.name}
                </Text>
              </button>
            );
          })}
      </div>
    </GroupWrapper>
  );
});

export default ChainFilter;
