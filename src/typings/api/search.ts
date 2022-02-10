export interface IGetSearchResultParams {
  text?: string;
  type?: string;
  is_verified?: boolean;
  max_price?: string;
  min_price?: string;
  order_by?: string;
  on_sale?: boolean | string;
  on_auc_sale?: boolean | string;
  on_timed_auc_sale?: boolean | string;
  currency?: string;
  tags?: string;
  page?: number;
  creator?: string;
  owner?: string;
  has_bids?: boolean;
  bids_by?: string;
  network?: string;
  collections?: string;
  properties?: string;
  rankings?: string;
  stats?: string;
}
