import React from 'react';
import { observer } from 'mobx-react-lite';

import {
  Modal,
  Checkout,
  ChooseSeller,
  PlaceBid,
  Burn,
  RemoveSale,
  PutOnSale,
  Transfer,
  Report,
  ChangePrice,
  Swap,
  Details,
} from 'components';
import { useMst } from 'store';

const Modals: React.FC = () => {
  const {
    modals: { sell, burn, remove, transfer, report, change, swap, details },
  } = useMst();
  return (
    <>
      <Modal visible={sell.checkout.getIsOpen} onClose={sell.checkout.close} title="Checkout">
        <Checkout />
      </Modal>
      <Modal
        maxWidth="565px"
        visible={sell.chooseSeller.getIsOpen}
        onClose={sell.chooseSeller.close}
        title={`Sellers (${sell.chooseSeller.sellers.length})`}
      >
        <ChooseSeller />
      </Modal>
      <Modal
        maxWidth="510px"
        visible={sell.placeBid.getIsOpen}
        onClose={sell.placeBid.close}
        title="Place a Bid"
      >
        <PlaceBid />
      </Modal>
      <Modal maxWidth="510px" visible={burn.getIsOpen} onClose={burn.close} title="Burn token">
        <Burn />
      </Modal>
      <Modal
        maxWidth="510px"
        visible={remove.getIsOpen}
        onClose={remove.close}
        title="Remove from sale"
      >
        <RemoveSale />
      </Modal>
      <Modal
        maxWidth="510px"
        visible={transfer.getIsOpen}
        onClose={transfer.close}
        title="Transfer token"
      >
        <Transfer />
      </Modal>
      <Modal
        maxWidth="510px"
        visible={sell.putOnSale.getIsOpen}
        onClose={sell.putOnSale.close}
        title="Put on sale"
      >
        <PutOnSale />
      </Modal>
      <Modal
        maxWidth="510px"
        visible={change.getIsOpen}
        onClose={change.close}
        title="Change price"
      >
        <ChangePrice />
      </Modal>
      <Modal maxWidth="510px" visible={report.isOpen} onClose={report.close} title="Report">
        <Report />
      </Modal>
      <Modal maxWidth="510px" title="Convert" visible={swap.isOpen} onClose={swap.close}>
        <Swap />
      </Modal>
      <Modal
        maxWidth="510px"
        title={details.type}
        visible={details.getIsOpen}
        onClose={details.close}
      >
        <Details />
      </Modal>
    </>
  );
};

export default observer(Modals);
